import React from 'react'
import cvData from '../../../public/json/my-cv.json'
import { CVData } from '../../types/CV'
import CV from './CV'

const CVPage: React.FC = () => {
  return (
    <div>
      <CV data={cvData as CVData} />
    </div>
  )
}

export default CVPage