# **Database Design**

## **Database Name**

student\_management\_system

---

## **Table: Users**

| Field | Type |
| :---- | :---- |
| user\_id | INT |
| username | VARCHAR(50) |
| password | VARCHAR(255) |
| role | VARCHAR(20) |

---

## **Table: Students**

| Field | Type |
| :---- | :---- |
| student\_id | INT |
| name | VARCHAR(100) |
| email | VARCHAR(100) |
| phone | VARCHAR(20) |
| address | VARCHAR(255) |

---

## **Table: Courses**

| Field | Type |
| :---- | :---- |
| course\_id | INT |
| course\_name | VARCHAR(100) |
| credit | INT |

---

## **Table: Enrollments**

| Field | Type |
| :---- | :---- |
| enrollment\_id | INT |
| student\_id | INT |
| course\_id | INT |

---

## **Table: Attendance**

| Field | Type |
| :---- | :---- |
| attendance\_id | INT |
| student\_id | INT |
| date | DATE |
| status | VARCHAR(20) |

---

## **Table: Grades**

| Field | Type |
| :---- | :---- |
| grade\_id | INT |
| student\_id | INT |
| course\_id | INT |
| grade | VARCHAR(5) |

---

## **Primary Keys**

* user\_id  
* student\_id  
* course\_id  
* enrollment\_id  
* attendance\_id  
* grade\_id

## **Foreign Keys**

* student\_id  
* course\_id

