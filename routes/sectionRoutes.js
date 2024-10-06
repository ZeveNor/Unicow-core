import express from "express";
import SectionController from "../controllers/section/sectionController.js";

const router = express.Router();

/* API Routing Path
    Get /api/sections/
    Get /api/sections/:id
    Create /api/sections/
    Update /api/sections/:id
    Delete /api/sections/:id
    Permanent Delete /api/sections/:id (Force Delete Danger!!)
*/

// Get all sections (GET /api/sections/)
router.get('/', async (req, res) => {
    try {
        const data = await SectionController.getAllSection();
        res.status(200).json({ status: '200', result: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Get sections by ID (GET /api/sections/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status: '400', result: 'ID is required.' });
    }
    try {
        const data = await SectionController.getSectionById(id);
        if (data != null) {
            res.status(200).json({ status: '200', result: data });
        }else {
            res.status(400).json({ code: '400', description: 'Section ID not found.' });
        }
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Create a new sections (POST /api/sections/)
router.post('/', async (req, res) => {
    const sectionsData = {
        name: req.body.name,
    };
    if (!req.body.name){
        res.status(400).json({ status:'400',result: 'name is required.' });
    }
    try {
        const checkName = await SectionController.isSectionNameDuplicate(sectionsData)
        if (!checkName) {
            const data = await SectionController.createSection(sectionsData);
            res.status(201).json({ status: 201, result: data });
        }else {
            res.status(400).json({ status: '400', result: 'Section name is duplicated.' });
        }
    } catch (err) {
        res.status(500).json({ status: 500, message: 'Error creating sections' });
    }
});

// Update a sections by ID (UPDATE /api/sections/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const sectionsData = {
        name: req.body.name,
    };

    if (!id) {
        res.status(400).json({status:'400',result: 'update must be have input.'});
    }
    try{
        const checkName = await SectionController.isSectionNameDuplicate(sectionsData)
        if (!checkName) {
            const data = await SectionController.updateSection(id, sectionsData);
            res.status(201).json({ status: '201', result: data });
        }
        else{
            res.status(400).json({ status: '400', result: 'Section name is duplicated.' });
        }

    }catch(err){
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
})

// Delete a sections by ID set isDelete to false
router.put('/delete/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try {
        const data = await SectionController.deleteSection(id);
        res.status(200).json({ status: '200', result: data });
    }catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
})

// Restore a sections by ID set isDelete to true
router.put('/restore/:id',async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try{
        const data = await SectionController.restoreSection(id);
        res.status(200).json({ status: '200', result: data});
    } catch (err){
        res.status(500).json({ status: '500', result: 'Internal Server Error'});
    }
})

// Force delete sections from database
router.delete('/:id',async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try{
        const data = await SectionController.forceDeleteSection(id);
        res.status(200).json({ status: '200', result: data, desc: 'Forces deleted completed.' });
    } catch (err){
        res.status(500).json({ status: '500', result: 'Internal Server Error'});
    }
})





export default router;