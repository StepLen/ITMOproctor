var express = require('express');
var router = express.Router();
var db = require('../db');
// Get list of users
router.get('/users', function (req, res) {
	var args = {
		data: req.query
	};
	db.profile.search(args, function (err, data, count) {
		if (!err && data) {
			res.json({
				"total": count,
				"rows": data
			});
		}
		else {
			res.json({
				"total": 0,
				"rows": []
			});
		}
	});
});
// Get list of exams
router.get('/exams', function (req, res) {
	var args = {
		data: req.query
	};
	db.exam.search(args, function (err, data, count) {
		if (!err && data) {
			res.json({
				"total": count,
				"rows": data
			});
		}
		else {
			res.json({
				"total": 0,
				"rows": []
			});
		}
	});
});
// Get list of schedules
router.get('/schedules', function (req, res) {
	var args = {
		data: req.query
	};
	db.schedule.search(args, function (err, data, count) {
		if (!err && data) {
			res.json({
				"total": count,
				"rows": data
			});
		}
		else {
			res.json({
				"total": 0,
				"rows": []
			});
		}
	});
});


router.get('/proctor_stat', function (req, res) {
	var query = req.query;
	var User = require('../db/models/user');

	User.aggregate([
			{
				$lookup: {
					from: 'exams',
					localField: '_id',
					foreignField: 'inspector',
					as: 'exams'
				}
			},
			{
				$match: {
					role: 2,
					active: true
				},
			},
			{
				$project: {
					firstname: 1,
					middlename: 1,
					lastname: 1,
					exams: 1
				}
			}
		],
		function (err, data) {
			res.json({error: err, data: data});
		});


});

module.exports = router;
