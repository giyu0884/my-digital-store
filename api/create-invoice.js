import axios from "axios";

export default async function handler(req,res){
    if(req.method!=="POST") return res.status(405).json({error:"Method not allowed"});
    const { external_id, amount, payer_email, description } = req.body;
    try{
        const response = await axios.post(
            "https://api.xendit.co/v2/invoices",
            { external_id, amount, payer_email, description,
              success_redirect_url:"https://my-digital-store.vercel.app",
              failure_redirect_url:"https://my-digital-store.vercel.app" },
            { auth:{ username:process.env.XENDIT_API_KEY, password:"" } }
        );
        res.status(200).json(response.data);
    } catch(err){
        console.error(err.response?.data || err);
        res.status(500).json({error:"Invoice creation failed"});
    }
}
