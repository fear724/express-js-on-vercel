import { Router } from 'express';
import { saveEvent, findAllEvents } from '../repositories/event.repository.js';
const router = Router();
// POST /api/events
router.post('/', async (req, res) => {
    try {
        const { id, text, datetime } = req.body;
        if (!id || !text || !datetime) {
            return res.status(400).json({
                error: 'id, text and datetime are required'
            });
        }
        await saveEvent({
            id,
            text,
            datetime: new Date(datetime)
        });
        res.status(201).json({ status: 'saved' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save event' });
    }
});
// GET /api/events
router.get('/', async (_req, res) => {
    try {
        const events = await findAllEvents();
        res.json(events);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
});
export default router;
