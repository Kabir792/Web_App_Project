export async function loginApi(adminId, password) {
  try {
    // Simple authentication check for Shawon Afrin Badhon (ID: 2222625) or Admin ID
    if (adminId && password) {
      return {
        success: true,
        message: 'Login Successful',
        user: {
          adminId: adminId,
          name: adminId === '2222625' ? 'Shawon Afrin Badhon' : 'System Admin',
          role: 'Admin'
        },
        token: `token_${adminId}`
      };
    }
    return { success: false, message: 'Invalid Admin ID or Password' };
  } catch (error) {
    return { success: false, message: 'Authentication error' };
  }
}

export async function logoutApi() {
  return { success: true, message: 'Logged out successfully' };
}
