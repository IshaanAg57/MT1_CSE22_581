
const express = require('express');

const app = express();
app.use(express.json());

let students = [];
let nextId = 1;

// POST - Add a new student
app.post('/api/students', (req, res) => {
    const { name, course, age } = req.body;

    if (!name || !course || age === undefined ||
        name.trim() === '' || course.trim() === '' ||
        typeof age !== 'number' || !Number.isFinite(age)) {
        return res.status(400).json({
            message: 'Please provide valid name, course and age'
        });
    }

    const existingStudent = students.find(
        student => student.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (existingStudent) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    const newStudent = {
        id: nextId++,
        name: name.trim(),
        course: course.trim(),
        age: age
    };

    students.push(newStudent);

    res.status(201).json({
        message: 'Student added successfully',
        student: newStudent
    });
});


// GET - Get all students (with optional course filter)
app.get('/api/students', (req, res) => {
    const { course } = req.query;

    let result = students;

    if (course) {
        result = students.filter(
            student => student.course.toLowerCase() === course.toLowerCase()
        );
    }

    res.status(200).json(result);
});


// GET - Get student by ID
app.get('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    res.status(200).json(student);
});


// PUT - Update student by ID
app.put('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const student = students.find(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || !student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const { name, course, age } = req.body;

    if (!name || !course || age === undefined ||
        name.trim() === '' || course.trim() === '' ||
        typeof age !== 'number' || !Number.isFinite(age)) {
        return res.status(400).json({
            message: 'Please provide valid name, course and age'
        });
    }

    const duplicate = students.find(
        s => s.id !== id &&
        s.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (duplicate) {
        return res.status(409).json({
            message: 'Student name already exists'
        });
    }

    student.name = name.trim();
    student.course = course.trim();
    student.age = age;

    res.status(200).json({
        message: 'Student updated successfully',
        student: student
    });
});


// DELETE - Delete student by ID
app.delete('/api/students/:id', (req, res) => {
    const id = Number(req.params.id);

    const index = students.findIndex(s => s.id === id);

    if (!Number.isInteger(id) || id <= 0 || index === -1) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const deletedStudent = students.splice(index, 1)[0];

    res.status(200).json({
        message: 'Student deleted successfully',
        student: deletedStudent
    });
});


// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
