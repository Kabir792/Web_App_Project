# **API Design**

## **Authentication APIs**

### **Login**

POST /api/auth/login

Request:

{  
"username": "admin",  
"password": "password"  
}

Response:

{  
"message": "Login Successful"  
}

---

### **Logout**

POST /api/auth/logout

---

## **Student APIs**

### **Get All Students**

GET /api/students

### **Get Student By ID**

GET /api/students/{id}

### **Create Student**

POST /api/students

### **Update Student**

PUT /api/students/{id}

### **Delete Student**

DELETE /api/students/{id}

---

## **Attendance APIs**

### **Record Attendance**

POST /api/attendance

### **Get Attendance**

GET /api/attendance/{studentId}

---

## **Grade APIs**

### **Add Grade**

POST /api/grades

### **Get Grades**

GET /api/grades/{studentId}

---

## **Report APIs**

### **Student Report**

GET /api/reports/student

### **Attendance Report**

GET /api/reports/attendance

### **Grade Report**

GET /api/reports/grades

---

## **API Security**

* Authentication Required  
* Session Validation  
* Role-Based Authorization

## **Response Format**

Success:

{  
"status": "success",  
"data": {}  
}

Error:

{  
"status": "error",  
"message": "Operation Failed"  
}

