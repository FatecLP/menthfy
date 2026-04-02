const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

router.get('/', professorController.getAllProfessores);
router.get('/:id', professorController.getProfessorById);
router.get('/nome/:nome', professorController.getProfessorByName);

module.exports = router;
