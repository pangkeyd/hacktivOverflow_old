const express = require('express');
const router = express.Router()
const Index = require('../controllers/index')

router.get('/', Index.getData)

router.get('/:slug', Index.getDataBySlug)

router.get('/:slug/:username/upvotes', Index.getVotesData)

router.get('/:slug/:username/downvotes', Index.getDownVotesData)

router.post('/', Index.postData)

router.post('/:slug', Index.postQuestion)

router.get('/:slug', Index.getDataQuesCount)

router.delete('/:_id', Index.deleteData)

router.delete('/:slug/:_id', Index.deleteQuestion)

module.exports = router
