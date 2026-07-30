import json
import os

class AuthService:
    def __init__(self, users_file_path=None):
        if users_file_path is None:
            base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            self.users_file_path = os.path.join(base_dir, "data", "users.json")
        else:
            self.users_file_path = users_file_path

    def login(self, user_id, password):
        if not os.path.exists(self.users_file_path):
            return False, {"message": "User database not initialized"}, 500

        try:
            with open(self.users_file_path, 'r', encoding='utf-8') as f:
                users = json.load(f)

            user_id_clean = str(user_id).strip().lower()
            password_clean = str(password).strip()

            for user in users:
                if str(user.get("user_id")).strip().lower() == user_id_clean and str(user.get("password")) == password_clean:
                    user_data = {
                        "user_id": user.get("user_id"),
                        "name": user.get("name"),
                        "role": user.get("role")
                    }
                    return True, {
                        "success": True,
                        "message": "Login successful",
                        "user": user_data
                    }, 200

            return False, {
                "success": False,
                "message": "Invalid User ID or Password"
            }, 401
        except Exception as e:
            return False, {
                "success": False,
                "message": f"Authentication error: {str(e)}"
            }, 500
