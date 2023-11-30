import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from '@chakra-ui/react'
import FormWrapper from './FormWrapper'
import { QUIZ_TIMERS } from '@/constants'

export default function NumInput({
    label,
    inputValue,
    handleInputChange
}) {
  return (
    <>
      <FormWrapper label={label}>
        <NumberInput
          value={inputValue} onChange={(e)=>{handleInputChange(e)}}
          step={5} defaultValue={QUIZ_TIMERS.MEDIUM} min={QUIZ_TIMERS.RAPID} max={QUIZ_TIMERS.LONG}
          variant='flushed'
          size='sm'
          p={0}
          borderBottom={'0.7px solid #6E5CEC5c'}
          borderTop={'0px'}
          borderLeft={'0px'}
          borderRight={'0px'}
          borderRadius={'none'}
          _focus={{borderColor: '#6E5CEC', boxShadow: 'none'}}
          >
          <NumberInputField/>
          <NumberInputStepper>
              <NumberIncrementStepper border={'none'}/>
              <NumberDecrementStepper border={'none'}/>
          </NumberInputStepper>
        </NumberInput>
      </FormWrapper>
    </>
  )
}