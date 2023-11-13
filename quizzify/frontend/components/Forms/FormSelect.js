import { Select } from '@chakra-ui/react'
import FormWrapper from './FormWrapper'

export default function FormSelect({
    type,
    label,
    placeholder,
    inputValue,
    handleInputChange,
    ...otherProps
}) {
  return (
    <>
      <FormWrapper label={label}>
        <Select type={type} value={inputValue} onChange={(e)=>{handleInputChange(e.target.value)}}
          placeholder={placeholder}
          _placeholder={{ opacity: 1, color: 'secondary.400' }}
          variant='flushed'
          size='sm'
          p={0}
          borderBottom={'1px solid #6E5CEC5c'}
          borderTop={'0px'}
          borderLeft={'0px'}
          borderRight={'0px'}
          borderRadius={'none'}
          _focus={{borderColor: '#6E5CEC', boxShadow: 'none'}}
        >
          {otherProps.children}
        </Select>
      </FormWrapper>
    </>
  )
}