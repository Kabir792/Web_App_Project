import { db } from './db';

class SyncEngine {
  constructor() {
    this.isOnline = navigator.onLine;
    this.listeners = new Set();
    this.isSyncing = false;

    window.addEventListener('online', () => this.handleNetworkChange(true));
    window.addEventListener('offline', () => this.handleNetworkChange(false));
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback({ isOnline: this.isOnline, isSyncing: this.isSyncing });
    return () => this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach((cb) =>
      cb({ isOnline: this.isOnline, isSyncing: this.isSyncing })
    );
  }

  async handleNetworkChange(isOnline) {
    this.isOnline = isOnline;
    this.notifyListeners();
    if (isOnline) {
      console.log('⚡ Network connection restored. Triggering auto-sync...');
      await this.triggerSync();
    } else {
      console.log('📡 Offline mode activated. All actions saving to IndexedDB...');
    }
  }

  async saveAssignment(assignmentData) {
    const now = new Date().toISOString();
    const assignment = {
      ...assignmentData,
      id: assignmentData.id || `asgn-${Date.now()}`,
      sync_status: this.isOnline ? 'synced' : 'pending',
      updated_at: now
    };

    await db.assignments.put(assignment);

    if (!this.isOnline) {
      await db.syncQueue.put({
        item_id: assignment.id,
        action: 'upsert',
        timestamp: Date.now()
      });
    } else {
      try {
        await fetch('/api/campus/assignments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(assignment)
        });
      } catch (err) {
        assignment.sync_status = 'pending';
        await db.assignments.put(assignment);
        await db.syncQueue.put({
          item_id: assignment.id,
          action: 'upsert',
          timestamp: Date.now()
        });
      }
    }

    this.notifyListeners();
    return assignment;
  }

  async deleteAssignment(id) {
    await db.assignments.delete(id);

    if (!this.isOnline) {
      await db.syncQueue.put({
        item_id: id,
        action: 'delete',
        timestamp: Date.now()
      });
    } else {
      try {
        await fetch(`/api/campus/assignments/${id}`, { method: 'DELETE' });
      } catch (err) {
        await db.syncQueue.put({
          item_id: id,
          action: 'delete',
          timestamp: Date.now()
        });
      }
    }

    this.notifyListeners();
  }

  async triggerSync() {
    if (this.isSyncing || !this.isOnline) return;

    this.isSyncing = true;
    this.notifyListeners();

    try {
      const pendingItems = await db.assignments
        .where('sync_status')
        .equals('pending')
        .toArray();

      const queueOps = await db.syncQueue.toArray();

      if (pendingItems.length === 0 && queueOps.length === 0) {
        this.isSyncing = false;
        this.notifyListeners();
        return;
      }

      const payloadItems = pendingItems.map((item) => ({
        ...item,
        _action: 'upsert'
      }));

      const deleteOps = queueOps.filter((q) => q.action === 'delete');
      deleteOps.forEach((op) => {
        payloadItems.push({ id: op.item_id, _action: 'delete' });
      });

      const response = await fetch('/api/campus/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: payloadItems })
      });

      if (response.ok) {
        for (const item of pendingItems) {
          item.sync_status = 'synced';
          await db.assignments.put(item);
        }
        await db.syncQueue.clear();
      }
    } catch (error) {
      console.error('Error during offline sync:', error);
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }
}

export const syncEngine = new SyncEngine();
