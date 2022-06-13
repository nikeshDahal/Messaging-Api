const express = require('express');
const userRouter = new express.Router();
const User = require("../models/users");
const auth = require('../middlewares/auth');

//......................create  users...............//
userRouter.post("/users",async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      const tokens = await user.generateAuthToken()
      res.status(200).send({user,tokens});
    } catch (error) {
      res.status(400).send(error)
    }
  });


//.........................login user....................//
userRouter.post("/users/login", async (req,res)=>{
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const tokens = await user.generateAuthToken();
        res.status(201).send({user,tokens});
    } catch (error) {
        res.status(400).send({
        error:"unable to get user"
        })
    }
    })


  //....................logout user..................//
  userRouter.get("/users/logout", auth, async (req,res)=>{
    try {
      req.user.tokens=req.user.tokens
      .filter((iteratingToken)=>{
        return iteratingToken.token !== req.token 
      })
      await req.user.save()
      res.send({message:"user log out"});
    } catch (error) {
      res.status(400).send();
    }
 
  })

module.exports=userRouter