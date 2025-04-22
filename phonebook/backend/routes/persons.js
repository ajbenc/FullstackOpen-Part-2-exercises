import { Router } from 'express';
import { 
  getPersons, 
  createPerson, 
  updatePerson, 
  deletePerson 
} from '../controllers/persons.js';

const router = Router();

router.get('/', getPersons);
router.post('/', createPerson);
router.put('/:id', updatePerson);
router.delete('/:id', deletePerson);

export default router;