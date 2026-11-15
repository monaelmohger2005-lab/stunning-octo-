 // كلاس الطالب
class Student {
    #grades;
    #attendance;

    constructor(id, name, grades, attendance) {
        this.id = id;
        this.name = name;
        this.grades = grades;
        this.attendance = attendance;
    }

    set grades(value) {
        if (!Array.isArray(value) || value.length !== 3) {
            throw new Error("يجب إدخال درجات 3 مواد");
        }

        if (value.some(grade =>
            !Number.isFinite(grade) ||
            grade < 0 ||
            grade > 100
        )) {
            throw new Error("الدرجات يجب أن تكون من 0 إلى 100");
        }

        this.#grades = value;
    }

    get grades() {
        return this.#grades;
    }

    set attendance(value) {
        if (
            !Number.isFinite(value) ||
            value < 0 ||
            value > 100
        ) {
            throw new Error("نسبة الحضور يجب أن تكون من 0 إلى 100");
        }

        this.#attendance = value;
    }

    get attendance() {
        return this.#attendance;
    }

    getAverage() {
        const total = this.#grades.reduce(
            (sum, grade) => sum + grade,
            0
        );

        return total / this.#grades.length;
    }

    getGrade() {
        const average = this.getAverage();

        if (average >= 90) return "A";
        else if (average >= 80) return "B";
        else if (average >= 70) return "C";
        else if (average >= 60) return "D";
        else return "F";
    }
}

// عناصر الصفحة
const studentName = document.getElementById("studentName");
const grade1 = document.getElementById("grade1");
const grade2 = document.getElementById("grade2");
const grade3 = document.getElementById("grade3");
const attendance = document.getElementById("attendance");

const addStudent = document.getElementById("addStudent");
const mercyCommittee = document.getElementById("mercyCommittee");

const errorBox = document.getElementById("errorBox");
const studentsList = document.getElementById("studentsList");
const report = document.getElementById("report");

// مصفوفة الطلاب
const students = [];

// إضافة طالب
addStudent.addEventListener("click", function () {
    try {
        const name = studentName.value.trim();

        if (name === "") {
            throw new Error("من فضلك أدخل اسم الطالب");
        }

        if (
            grade1.value.trim() === "" ||
            grade2.value.trim() === "" ||
            grade3.value.trim() === "" ||
            attendance.value.trim() === ""
        ) {
            throw new Error("من فضلك أكمل جميع البيانات");
        }

        const grades = [
            Number(grade1.value),
            Number(grade2.value),
            Number(grade3.value)
        ];

        const studentAttendance = Number(attendance.value);

        const student = new Student(
            students.length + 1,
            name,
            grades,
            studentAttendance
        );

        students.push(student);

        const studentCard = document.createElement("div");
        studentCard.className = "alert alert-info mt-3";

        studentCard.textContent =
            `الطالب: ${student.name} | ` +
            `الدرجات: ${student.grades.join(" - ")} | ` +
            `الحضور: ${student.attendance}% | ` +
            `المتوسط: ${student.getAverage().toFixed(2)} | ` +
            `التقدير: ${student.getGrade()}`;

        studentsList.appendChild(studentCard);

        errorBox.textContent = "";
        report.innerHTML = "";

        studentName.value = "";
        grade1.value = "";
        grade2.value = "";
        grade3.value = "";
        attendance.value = "";

    } catch (error) {
        errorBox.textContent = error.message;
    }
});

// لجنة الرأفة
mercyCommittee.addEventListener("click", function () {

    const strugglingStudents = students.filter(student => {
        const average = student.getAverage();
        return average >= 40 && average <= 49;
    });

    if (strugglingStudents.length === 0) {
        report.textContent =
            "لا يوجد طلاب يحتاجون إلى لجنة الرأفة.";
        return;
    }

    const adjustedStudents = strugglingStudents.map(student => {
        return {
            name: student.name,
            oldAverage: student.getAverage(),
            newAverage: student.getAverage() + 5
        };
    });

    const totalAverage = adjustedStudents.reduce(
        (sum, student) => sum + student.newAverage,
        0
    );

    const generalAverage =
        totalAverage / adjustedStudents.length;

    const names = adjustedStudents.map(student => {
        return `
            <li>
                ${student.name} -
                المتوسط قبل الرأفة:
                ${student.oldAverage.toFixed(2)} -
                المتوسط بعد الرأفة:
                ${student.newAverage.toFixed(2)}
            </li>
        `;
    }).join("");

    report.innerHTML = `
        <h4>تقرير لجنة الرأفة</h4>
        <p>عدد الطلاب المتعثرين:
        ${strugglingStudents.length}</p>
        <ul>${names}</ul>
        <p>
            المتوسط العام بعد الرأفة:
            ${generalAverage.toFixed(2)}
        </p>
    `;
});