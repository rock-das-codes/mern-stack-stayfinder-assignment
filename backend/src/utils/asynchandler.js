const asynchandler = (functontorun)=>{
    return (req,res,next) =>{
        Promise
        .resolve(functontorun(req,res,next))
        .catch((err)=>next(err))
    }
}

export {asynchandler}