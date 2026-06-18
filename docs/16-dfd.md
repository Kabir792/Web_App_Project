# **Data Flow Diagram (DFD)**

## **Level 0 DFD**

External Entities:

* Administrator  
* Teacher  
* Student

Process:

* Student Management System

Data Store:

* Student Database

Flow:

Administrator → Student Management System → Student Database

Teacher → Student Management System → Student Database

Student → Student Management System → Student Database

---

## **Level 1 DFD**

Processes:

1. User Authentication  
2. Student Management  
3. Attendance Management  
4. Grade Management  
5. Report Generation

Data Stores:

* Users Database  
* Students Database  
* Attendance Database  
* Grades Database

Flow:

Administrator → Student Management

Teacher → Attendance Management

Teacher → Grade Management

Student → View Records

System → Generate Reports

