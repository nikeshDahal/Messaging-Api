const express = require('express');
const messageRouter = new express.Router();
const Message = require("../models/message");
const auth = require("../middlewares/auth");

//........................create message...................................//
messageRouter.post('/message',auth,async(req,res)=>{
    // console.log('users',req.user)
    const messages = new Message({
        ...req.body,
        sender:req.user._id,
    })
    try {
        const savedMessage= await messages.save();
        res.status(200).send(savedMessage);
    } catch (error) {
        res.status(400).send({
            error:"failed in creating message"
        })
    }
})


// GET  /message?sortBy=createdAt:desc
//......................read all  messages send by the  of auth user................//
messageRouter.get('/message',auth, async (req,res)=>{
    const sort={}
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]]=parts[1] ==='desc' ? -1 : 1 ;
      }
      try {
        await req.user.populate({
            path:'messageList',
            options:{
                sort
            }
        })
        res.status(200).send(req.user.messageList)
      } catch (error) {
        res.send(error);
      }
    })


//........................update messages .........................//
messageRouter.patch('/messages/:id',auth,async(req,res)=>{
    const allowedUpdates=['message'];
    const updates=Object.keys(req.body);
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation){
      res.status(400).send({
        error:"invalid updates"
      })
    }
    try {
      const _id = req.params.id;
      const message =await Message.findOne({
        _id,
        sender:req.user._id
      });
      if(!message){
        return res.status(404).send();
      }
      updates.forEach((update)=>message[update]=req.body[update]);
      await message.save();
      res.status(200).send(message);
    } catch (error) {
      res.status(401).send({
        error:"unable to update"
      });
    }
  })

//.......................deleting message.....................//
messageRouter.delete('/message/:id',auth,async(req,res)=>{
    try {
      const message = await Message.findOneAndDelete({
        _id:req.params.id,
        sender : req.user._id
      })
      if(!message){
        return res.status(400).send({
          error:"user not found"
        });
      }
      res.status(200).send(message);
      
    } catch (error) {
      res.status(400).send({
        error:"error"
      })
    }
  })

module.exports = messageRouter;


 