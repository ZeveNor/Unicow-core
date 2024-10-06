import express from "express";
import CurriculumController from "../controllers/curriculum/curriculumController.js";

const router = express.Router();

/* API Routing Path
    Get /api/curriculums/
    Get /api/curriculums/:id
    Create /api/curriculums/
    Update /api/curriculums/:id
    Delete /api/curriculums/:id
    Permanent Delete /api/curriculums/:id (Force Delete Danger!!)
*/

// Get all curriculums (GET /api/curriculums/)
router.get('/', async (req, res) => {
    try {
        const data = await CurriculumController.getAllCurriculum();
        res.status(200).json({ status: '200', result: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Get curriculums by ID (GET /api/curriculums/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status: '400', result: 'ID is required.' });
    }
    try {
        const data = await CurriculumController.getCurriculumById(id);
        if (data != null) {
            res.status(200).json({ status: '200', result: data });
        }else {
            res.status(400).json({ code: '400', description: 'Curriculum ID not found.' });
        }
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Create a new curriculums (POST /api/curriculums/)
router.post('/', async (req, res) => {
    const curriculumsData = {
        curr_name_th: req.body.curr_name_th,
        curr_name_en: req.body.curr_name_en,
        short_name_th: req.body.short_name_th,
        short_name_en: req.body.short_name_en
    };

    if (!req.body.curr_name_th || !req.body.curr_name_en || !req.body.short_name_th || !req.body.short_name_en) {
        return res.status(400).json({ status: '400', result: 'All fields are required.' });
    }

    try {
        const checkNameCTH = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.curr_name_th, 'curr_name_th');
        const checkNameCEN = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.curr_name_en, 'curr_name_en');
        const checkNameSTH = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.short_name_th, 'short_name_th');
        const checkNameSEN = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.short_name_en, 'short_name_en');
        if (!checkNameCTH && !checkNameCEN && !checkNameSTH && !checkNameSEN) {
            const data = await CurriculumController.createCurriculum(curriculumsData);
            return res.status(201).json({ status: 201, result: data });
        } else {
            return res.status(400).json({ status: '400', result: 'Curriculum name is duplicated.' });
        }
    } catch (err) {
        console.error("Error creating curriculum:", err);
        return res.status(500).json({ status: 500, message: 'Error creating curriculum' });
    }
});

// Update a curriculums by ID (UPDATE /api/curriculums/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const curriculumsData = {
        curr_name_th: req.body.curr_name_th,
        curr_name_en: req.body.curr_name_en,
        short_name_th: req.body.short_name_th,
        short_name_en: req.body.short_name_en
    };

    if (!id) {
        res.status(400).json({status:'400',result: 'update must be have input.'});
    }
    try{
        const checkNameCTH = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.curr_name_th, 'curr_name_th', id);
        const checkNameCEN = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.curr_name_en, 'curr_name_en', id);
        const checkNameSTH = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.short_name_th, 'short_name_th', id);
        const checkNameSEN = await CurriculumController.isCurriculumNameDuplicate(curriculumsData.short_name_en, 'short_name_en', id);

        if (!checkNameCTH && !checkNameCEN && !checkNameSTH && !checkNameSEN) {
            const data = await CurriculumController.updateCurriculum(id, curriculumsData);
            res.status(201).json({ status: '201', result: data });
        }
        else{
            res.status(400).json({ status: '400', result: 'Curriculum name is duplicated.' });
        }

    }catch(err){
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
})

// Delete a curriculums by ID set isDelete to false
router.put('/delete/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try {
        const data = await CurriculumController.deleteCurriculum(id);
        res.status(200).json({ status: '200', result: data });
    }catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
})

// Restore a curriculums by ID set isDelete to true
router.put('/restore/:id',async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try{
        const data = await CurriculumController.restoreCurriculum(id);
        res.status(200).json({ status: '200', result: data});
    } catch (err){
        res.status(500).json({ status: '500', result: 'Internal Server Error'});
    }
})

// Force delete curriculums from database
router.delete('/:id',async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try{
        const data = await CurriculumController.forceDeleteCurriculum(id);
        res.status(200).json({ status: '200', result: data , desc: 'Forces deleted completed.'});
    } catch (err){
        res.status(500).json({ status: '500', result: 'Internal Server Error'});
    }
})



export default router;