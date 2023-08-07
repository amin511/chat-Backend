const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { NotFoundError } = require("../errors");

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userID

  console.log(req.user)
  const job = await Job.create(req.body);
  res.status(StatusCodes.OK).json({
    job
  })
}

const getAllJobs = async (req, res) => {
  console.log(req.user.userID)
  const Jobs = await Job.find({ createdBy: req.user.userID }).sort("createdAt");

  res.status(StatusCodes.OK).json({ Jobs })
}

const updateJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobId }
  } = req

  const job = await Job.updateOne({ _id: jobId, createdBy: userID },
    req.body,
    { new: true, runValidators: true })

}
const getJob = async (req, res) => {
  const { user: { userID }, params: { id: jobId } } = req
  const job = await Job.findOne({ _id: jobId, createdBy: userID })
  if (!job) {
    throw new NotFoundError(`Not Found Job With this id :${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
  res.send("delete Jon");
}

module.exports = { createJob, getAllJobs, updateJob, getAllJobs, getJob, deleteJob }