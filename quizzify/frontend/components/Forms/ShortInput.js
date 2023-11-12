import { Input } from '@chakra-ui/react'
import FormWrapper from './FormWrapper'

export default function ShortInput({
    type,
    label,
    placeholder,
    inputValue,
    handleInputChange,
}) {
  return (
    <>
      <FormWrapper label={label}>
        <Input type={type} value={inputValue} onChange={(e)=>{handleInputChange(e.target.value)}}
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
          />
      </FormWrapper>
    </>
  )
}