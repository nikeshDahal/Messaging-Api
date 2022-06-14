const express = require('express');
const userRouter = new express.Router();
const User = require("../models/users");
const auth = require('../middlewares/auth');
const {sendWelcomeMail,sendFairwellMail} = require('../emails/account')

//......................create  users...............//
userRouter.post("/users",async (req, res) => {
    try {
      const user = new User(req.body);
      await user.save();
      sendWelcomeMail(user.email,user.name);
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

    // .................logout from all sessions................//
    userRouter.get("/users/logoutAll",auth,async(req,res)=>{
      try {
        req.user.tokens=[];
        await req.user.save();
        res.send({
          message:"logged out of all session"
        })
      } catch (error) {
        res.status(400).send({
          message:"error in logging out from all sessions"
        })
      }
    })

  //.....................get list of users.............//

  userRouter.get('/users/getList',auth,async(req,res)=>{
    try {
        const usersList = req.users //list of users from DB
        if(!usersList){
            throw new Error();
        }
        res.send(usersList);
    } catch (error) {
        res.status(400).send({error:"failed in ferching users"})
        
    }
  })

  //.....................user profile......................//
  userRouter.get('/users/me',auth,async(req,res)=>{
    try {
      const myProfile = req.user;
      if(!myProfile){
        throw new Error();
      }
      res.status(200).send(myProfile);//sends the found user from middleware>>>auth.
    } catch (error) {
      res.status(400).send({
        error:"profile not found"
      })
    }
  })

  //.......................update profile......................//
  userRouter.patch('/users/me',auth,async(req,res)=>{
    const allowedUpdates=['name','password','email'];
    const updates=Object.keys(req.body);
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update));
    if(!isValidOperation){
      res.status(400).send({
        error:"invalid updates"
      })
    }

    try {
      updates.forEach((update)=>req.user[update]=req.body[update]); // for updating fields
      await req.user.save();
      res.status(200).send(req.user); 
    } catch (error) {
      res.status(400).send({
        error:"unable to update fields"
      })
    }
  })

  //................................deleting user..................................//

  userRouter.delete('/users/me',auth,async(req,res)=>{
    try {
      const user = await req.user.remove();
      sendFairwellMail(user.email,user.name);
      res.status(200).send(user);
    } catch (error) {
      res.status(400).send({
        error:"unable to delete user"
      })
    }
  })
module.exports=userRouter