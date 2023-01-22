const joi=require('joi');
const passwordComplexity=require('joi-password-complexity');


const validation=(body)=>{
    const schema=joi.object({
        username:joi.string().required().label('User Name'),
        email:joi.string().email().required().label('Email'),
        password:passwordComplexity().required().label('Password'),
        secure_word:joi.string().required().label('User Name'),
        amount:joi.number().required().label('User Name'),
        DOB:joi.string().required().label('User Name'),
        upi:joi.string().required().label('User Name'),
        gender:joi.string().required().label('User Name'),
        address:joi.string().required().label('User Name'),
        acard:joi.number().required().label('User Name'),
        key1:joi.string().required().label('User Name'),
        key2:joi.string().required().label('User Name'),
        key3:joi.string().required().label('User Name')
    })

    return schema.validate(body);
}

module.exports={validation};

