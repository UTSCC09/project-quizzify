import {
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
  } from '@chakra-ui/react'
  
  export default function FormWrapper({
      label,
      helperText = '',
      ...otherProps
  }) {
    return (
      <>
          <FormControl>
              <FormLabel mb={0} fontWeight={600} fontSize={16} >{label}</FormLabel>
                {otherProps.children}
              <FormHelperText>{helperText}</FormHelperText>
          </FormControl>
      </>
    )
  }