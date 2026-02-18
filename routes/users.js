const express = require("express");
const {users} = require("../data/users.json");

const router = express.Router();

router.get("/",(req,res)=>{
    res.status(200).json({
        sucess:true,
        data: users
    })
})

router.get('/:id',(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=>each.id == id)

    if(!user){

        return res.status(404).json({
            sucess:false,
            message:`User Not Found for id: ${id}`
        })
    }

    res.status(200).json({
        sucess:true,
        data:user
    })
})

router.post('/',(req,res)=>{
    const{id,name,email,subscriptionType,subscriptionDate} = req.body;
    if(!id || !name || !email || !subscriptionType || !subscriptionDate){
        return res.status(400).json({
            sucess:false,
            message:"Please provide all the required fields"
        })
    }
    const user = users.find((each)=>each.id === id)
    if(user){
        return res.status(409).json({
            sucess:false,
            message:`User Already Exists with id: ${id}`
        })
    }
    users.push({id,name,email,subscriptionType,subscriptionDate})
    res.status(201).json({
        sucess:true,
        message:"User Created successfully"
    })
})

router.put('/:id',(req,res)=>{
    const {id} = req.params;
    const {data} = req.body;

    const user = users.find((each)=>each.id === id)
    if(!user){
        return res.status(404).json({
            sucess:false,
            message:`User not Found for id : ${id}`
        })
    }
    const updateUser = users.map((each)=>{
        if(each.id===id){
            return {
                ...each,
                ...data,
            }
        }
        return each
    })
    res.status(200).json({
        sucess:true,
        data:updateUser,
        message:"User Updated successfully"
    })
})

router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=>each.id === id)

    if(!user){
        return res.status(404).json({
            sucess:false,
            message:`User not Found for id: ${id}`
        })
    }
    const updateUsers = users.filter((each)=>each.id !== id)

    res.status(200).json({
        sucess: true,
        data:updateUsers,
        message:"User Deleted Successfully"
        
    })
})

router.get('/subscription-details/:id',(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=>each.id == id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:`User Not Found for id: ${id}`
        })
    }
    const getDateInDays = (data = "")=>{
        let date;
        if(data){
            date = new Date(data);
        }
        else{
            date = new Date();
        }
        let days = Math.floor(date / (1000*60*60*24));
        return days;
    }

    const subscriptionType = (date)=>{
        if(user.subscriptionType === "Basic"){
            date = date + 90;
        }
        else if(user.subscriptionType === "Standard"){
            date = date + 180;
        }
        else if(user.subscriptionType === "Premium"){
            date = date + 365;
        }   
        return date;

    }

    //subscription expiry date in days
    let returnDate = subscriptionType(getDateInDays(user.subscriptionDate));
    let currentDate = getDateInDays();
    let subscriptionDate = getDateInDays(user.subscriptionDate);
    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < currentDate,
        daysLeftForExpiration: subscriptionExpiration - currentDate,
        returnDAte :returnDate < currentDate ? "Subscription Expired" : returnDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 : 0
    }


    res.status(200).json({
        success:true,
        data:data,
    });
});

module.exports = router;