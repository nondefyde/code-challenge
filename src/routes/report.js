import {Router} from 'express';
import ReportModel from '../models/report';
import ReportController from '../controllers/report';

const router = Router();
const reportCtrl = new ReportController(ReportModel);

router.route('/reports')
	.get(reportCtrl.find)
	.post(reportCtrl.create);
router.param('id', reportCtrl.id);
router.route('/reports/:id')
	.get(reportCtrl.findOne)
	.put(reportCtrl.update)
	.delete(reportCtrl.delete);
export default router;
