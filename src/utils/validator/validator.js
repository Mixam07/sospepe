export const lengh42 = value => {
    if(!value || value.length !== 42 || value.slice(0,2) !== "0x") return "Please enter a valid ETH address."
}

const validate = (values, validators)  => {
    let errors = {};

    for (const key in values) {
        if(validators[key]){
            const error = validators[key](values[key]);
            if(typeof(error) === "string"){
                errors = {
                    ...errors,
                    [key]: error 
                }
            }
        }
    }

    return errors;
};

export default validate;