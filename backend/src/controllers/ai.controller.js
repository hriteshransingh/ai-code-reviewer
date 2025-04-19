import aiService from "../services/ai.service.js";


export const getReview = async(req, res) => {
    const code = req.body.code;
    const language = req.body.language;

    if(!code)
        return res.status(400).send("code is required");
try{
    const response = await aiService(code, language);
    res.send(response.text);
}
catch(error){
    console.log("Error in getResponse controller",error);
    res.status(500).send("Something went wrong while generating the response", error);
}
}

