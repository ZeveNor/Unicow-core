import express from 'express';
import PrefixController from '../controllers/prefix/prefixController.js';

const router = express.Router();

/* API Routing Path
    Get /api/prefixs/
    Get /api/prefixs/:id
    Create /api/prefixs/
    Update /api/prefixs/:id
    Delete /api/prefixs/:id
    Permanent Delete /api/prefixs/:id (Force Delete Danger!!)
*/

// Get all prefixs (GET /api/prefixs/)
router.get('/', async (req, res) => {
    try {
        const data = await PrefixController.getAllPrefix();
        res.status(200).json({ status: '200', result: data });
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Get prefixs by ID (GET /api/prefixs/:id)
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status: '400', result: 'ID is required.' });
    }
    try {
        const data = await PrefixController.getPrefixById(id);
        if (data != null) {
            res.status(200).json({ status: '200', result: data });
        }else {
            res.status(400).json({ code: '400', description: 'Prefix ID not found.' });
        }
    } catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
});

// Create a new prefixs (POST /api/prefixs/)
router.post('/', async (req, res) => {
    const prefixData = {
        name: req.body.name,
    };
    if (!req.body.name){
        res.status(400).json({ status:'400',result: 'name is required.' });
    }
    try {
        const checkName = await PrefixController.isPrefixNameDuplicate(prefixData)
        if (!checkName) {
            const data = await PrefixController.createPrefix(prefixData);
            res.status(200).json({ status: 200, result: data });
        }else {
            res.status(400).json({ status: '400', result: 'Prefix name is duplicated.' });
        }
    } catch (err) {
        res.status(500).json({ status: 500, message: 'Error creating prefix' });
    }
});

// Update a prefix by ID (UPDATE /api/prefixs/:id)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const prefixData = {
        name: req.body.name,
    };

    if (!id) {
        res.status(400).json({status:'400',result: 'update must be have input.'});
    }
    try{
        const checkName = await PrefixController.isPrefixNameDuplicate(prefixData)
        if (!checkName) {
            const data = await PrefixController.updatePrefix(id, prefixData);
            res.status(200).json({ status: '200', result: data });
        }
        else{
            res.status(400).json({ status: '400', result: 'Prefix name is duplicated.' });
        }

    }catch(err){
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
})

// Delete a prefix by ID set isDelete to false
router.put('/delete/:id', async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try {
        const data = await PrefixController.deletePrefix(id);
        res.status(200).json({ status: '200', result: data });
    }catch (err) {
        res.status(500).json({ status: '500', result: 'Internal Server Error' });
    }
})

// Restore a prefix by ID set isDelete to true
router.put('/restore/:id',async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try{
        const data = await PrefixController.restorePrefix(id);
        res.status(200).json({ status: '200', result: data});
    } catch (err){
        res.status(500).json({ status: '500', result: 'Internal Server Error'});
    }
})

// Force delete prefix from database
router.delete('/:id',async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(400).json({ status:'400', result: 'id is requires.'})
    }
    try{
        const data = await PrefixController.forceDeletePrefix(id);
        res.status(200).json({ status: '200', result: data });
    } catch (err){
        res.status(500).json({ status: '500', result: 'Internal Server Error'});
    }
})

export default router;
