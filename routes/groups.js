const router = require("express").Router();

// create new group 

router.post("/", async (req, res) =>{
    const userId = 123;
    const newGroup = new Group({
        members: [req.body.senderId, req.body.receiverId],
        desc: req.body.text
    });

    try{
        const savedGroup = await newGroup.save();
        res.status(200).json(savedGroup);
    }catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;