# **Entity Relationship Diagram (ERD)**

## **Entities**

### **Users**

| Attribute | Type |
| ----- | ----- |
| user\_id (PK) | INT |
| username | VARCHAR |
| password | VARCHAR |
| role | VARCHAR |

---

### **Students**

| Attribute | Type |
| :---- | :---- |
| student\_id (PK) | INT |
| name | VARCHAR |
| email | VARCHAR |
| phone | VARCHAR |
| address | VARCHAR |

---

### **Courses**

| Attribute | Type |
| :---- | :---- |
| course\_id (PK) | INT |
| course\_name | VARCHAR |
| credit | INT |

---

### **Enrollments**

| Attribute | Type |
| :---- | :---- |
| enrollment\_id (PK) | INT |
| student\_id (FK) | INT |
| course\_id (FK) | INT |

---

### **Attendance**

| Attribute | Type |
| :---- | :---- |
| attendance\_id (PK) | INT |
| student\_id (FK) | INT |
| date | DATE |
| status | VARCHAR |

---

### **Grades**

| Attribute | Type |
| :---- | :---- |
| grade\_id (PK) | INT |
| student\_id (FK) | INT |
| course\_id (FK) | INT |
| grade | VARCHAR |

## **Relationships**

* One Student can have many Enrollments.  
* One Course can have many Enrollments.  
* One Student can have many Attendance Records.  
* One Student can have many Grades.  
* One Course can have many Grades.

