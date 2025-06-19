import express from 'express'
import Jwt from 'jsonwebtoken';
import Stripe from 'stripe';
import 'dotenv/config'

import { products } from '../products';
import { User } from '../db/user';
import { Logger } from '../helpers/Logger';
import { IPayload } from '../middlewares/cookies';

export const userInfo = express.Router();

interface IMetadata extends Stripe.Metadata {
  email:string,
  productId:string
}

userInfo.get('/',async (req,res)=>{
  const token = req.cookies.MyTokenName;
  if(!token){
    res.status(200).json({ //401 won't show the error in the client span
      ok:false,
      message:"Missing token"
    })
    return
  }

  if (!process.env.SECRET) {
    throw new Error('SECRET environment variable is required');
  }
  const SECRET=process.env.SECRET;
  const payload = Jwt.verify(token, SECRET) as IPayload;
  const{email}=payload

  if(!email){
    res.status(404).json({
      ok:false,
      message:"email is required in payload"
    })
    return
  }
  const user =await User.findOne({email})
  if(!user){
    res.status(404).json({
      ok:false,
      message:"user not found"
    })
    return
  }

  // const trailDate=new Date()
  // const now=new Date()
  res.status(200).json({
    ok:true,
    message:"Welcome",
    email,
    status:user.active,
    // expirationDate:trailDate.setMinutes(now.getMinutes()+5),
    expirationDate:user.expirationDate,
    products
  })
})

userInfo.post('/checkout',async(req,res)=>{
  const{email}=req.cookies.payload
  const user =await User.findOne({email})

  if(!user){
    res.status(404).json({
      ok:false,
      message:"user not found"
    })
    return
  }
  if(user?.active){
    res.status(409).json({
      ok:false,
      message:"Your already have access"
    })
  }

  const {id}=req.body

  // Check if the id exists in the products array
  const product= products.find(product => product.id === id);

  if (!product) {
    res.status(400).json({
      ok: false,
      message: "Invalid product ID"
    });
    return
  }

  const stripe_apiKey=process.env.stripe_apiKey||""
  const stripe = new Stripe(stripe_apiKey)
  const session=await stripe.checkout.sessions.create({
    success_url:"/user",
    line_items:[{
      price_data:{
        currency:product.currency,
        product_data:{
          name:product.name
        },
        unit_amount:product.price
      },
      quantity:1
    }],
    metadata:{
      productId:product.id,
      email,
    } as IMetadata,
    mode:'payment'
  })

  console.log(session)

  res.status(200).json({
    ok:true,
    message: `You successfully bought ${product.name} for ${product.price}${product.currency}!`,
    url:session.url
  })
})


interface IMetadata extends Stripe.Metadata {
  email:string,
  productId:string
}
userInfo.post('/webhook',express.raw({type:'application/json'}),async(req,res)=>{
  console.log('webhook reached');
  const stripe_apiKey = process.env.stripe_apiKey || "";
  const stripe = new Stripe(stripe_apiKey);
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

  if (!sig) {
    res.status(400).json({
      ok: false,
      message: 'No stripe signature provided',
    });
    return 
  }

  let event;

  try {
    event = await stripe.webhooks.constructEventAsync(req.body, sig, webhookSecret);
    
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const metadata = session.metadata as IMetadata;
      
      if (!metadata.email || !metadata.productId) {
        Logger.error('Missing required metadata');
      }

      let expirationDate=null
      if(metadata.productId==products[0].id){
        expirationDate="never"
      }
      if(metadata.productId==products[1].id){
        const today = new Date();
        // Create new date 30 days from today
        expirationDate = new Date();
        expirationDate.setDate(today.getDate() + 30);
      }

      // Find or create user
      const user = await User.findOneAndUpdate(
        { email: metadata.email },
        {
          $set: {
            lastPayment: {
              date: new Date(),
              amount: session.amount_total ? session.amount_total / 100 : 0, // Convert from cents
              status: 'completed',
            },
            active: true,
            expirationDate,
          },
        },
        { upsert: true, new: true }
      );

      Logger.info(`User ${user.email} payment processed successfully`);

      // Here you might want to do something with the productId
      // For example, associate the product with the user
      // await ProductService.assignProductToUser(metadata.productId, user._id);
    }

    res.status(200).json({
      ok: true,
      message: 'Webhook processed successfully',
    });
    return 

  } catch (error) {
    Logger.error('Webhook error:', error);

    if (error instanceof Stripe.errors.StripeError) {
      res.status(400).json({
        ok: false,
        message: `Stripe error: ${error.message}`,
      });
      return 
    }

    if (error instanceof Error) {
      res.status(400).json({
        ok: false,
        message: `Error: ${error.message}`,
      });
      return 
    }

    res.status(500).json({
      ok: false,
      message: 'Internal server error',
    });
    return 
  }
})