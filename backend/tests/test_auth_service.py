import unittest

from services.auth_service import AuthService


class AuthServiceTests(unittest.TestCase):
    def test_teacher_login_succeeds_with_default_users_file(self):
        service = AuthService()

        success, response, status_code = service.login('2222625', 'teacher123')

        self.assertTrue(success)
        self.assertEqual(status_code, 200)
        self.assertEqual(response['user']['role'], 'TEACHER')


if __name__ == '__main__':
    unittest.main()
