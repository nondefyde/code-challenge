import {Router} from 'express';
import TodoModel from './todo';
import AppController from '../src/controllers/app';
const router = Router();
const appCtrl = new AppController(TodoModel);

router.route('/todos/search')
	.get(appCtrl.search);
router.route('/todos')
	.post(appCtrl.create)
	.get(appCtrl.find);
router.param('id', appCtrl.id);
router.route('/todos/:id')
	.get(appCtrl.findOne)
	.put(appCtrl.update)
	.delete(appCtrl.delete);

export default router;
