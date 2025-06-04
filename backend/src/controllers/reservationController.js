const Reservation = require('../models/Reservation');

exports.createReservation = async (req, res) => {
  try {
    const reservationId = await Reservation.create(req.body);
    const reservation = await Reservation.findById(reservationId);
    res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
};

exports.getReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.findAll();
    res.json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await Reservation.updateStatus(req.params.id, status);
    const reservation = await Reservation.findById(req.params.id);
    res.json(reservation);
  } catch (error) {
    console.error('Error updating reservation status:', error);
    res.status(500).json({ error: 'Failed to update reservation status' });
  }
}; 