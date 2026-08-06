import { db } from './db';

class DeadlineNotificationService {
  constructor() {
    this.permission = window.Notification ? Notification.permission : 'default';
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      this.permission = result;
      if (result === 'granted') {
        this.sendNotification('🔔 IUB Academic Alerts Active', {
          body: 'You will receive automatic alerts for Quizzes, Assignments, Midterms, Final Exams, and Lab Reports!',
          icon: '/iub-logo.png'
        });
        return true;
      }
    } catch (e) {
      console.error('Notification permission error:', e);
    }
    return false;
  }

  sendNotification(title, options = {}) {
    if (this.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/iub-logo.png',
          badge: '/iub-logo.png',
          ...options
        });
      } catch (e) {
        console.warn('Native notification failed:', e);
      }
    }
  }

  async checkUpcomingDeadlines() {
    const assignments = await db.assignments.toArray();
    const now = new Date();

    const upcomingOrOverdue = assignments.filter((a) => {
      if (a.is_completed || !a.due_date) return false;
      const due = new Date(a.due_date);
      const diffHours = (due - now) / (1000 * 60 * 60);
      return diffHours <= 48; // Alert for deadlines within 48 hours or overdue
    });

    if (upcomingOrOverdue.length > 0 && this.permission === 'granted') {
      const topTask = upcomingOrOverdue[0];
      const due = new Date(topTask.due_date);
      const isOverdue = due < now;
      
      const typeLabels = {
        quiz: '📝 QUIZ / CLASS TEST',
        assignment: '📄 ASSIGNMENT',
        midterm: '🎯 MIDTERM EXAM',
        final: '🏆 FINAL EXAM',
        lab_report: '🔬 LAB REPORT'
      };

      const label = typeLabels[topTask.task_type] || '⏰ DEADLINE ALERT';

      this.sendNotification(
        isOverdue ? `⚠️ OVERDUE: ${topTask.course_code}` : `${label}: ${topTask.course_code}`,
        {
          body: `${topTask.title} is ${isOverdue ? 'Overdue!' : 'due soon.'} Venue/Submit via IUB Portal.`,
          tag: `task-alert-${topTask.id}`
        }
      );
    }

    return upcomingOrOverdue;
  }
}

export const notificationService = new DeadlineNotificationService();
