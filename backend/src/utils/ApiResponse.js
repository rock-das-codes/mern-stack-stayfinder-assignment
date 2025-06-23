class ApiResponse{
    constructor(stausCode,data,message="successfull"){
        this.statusCode = this.statusCode
        this.message=message
        this.data=data
        this.success= statusCode<400

    }
}

export {ApiResponse}