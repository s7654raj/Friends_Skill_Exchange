const Conversation = require("../db/models/conversation");
const Message = require("../db/models/message");

exports.createConversation = async (req, res) => {
  const { senderId, receiverId } = req.body;
  try {
    let conversation = await Conversation.findOne({ members: { $all: [senderId, receiverId] } });
    if (!conversation) {
      conversation = new Conversation({ members: [senderId, receiverId] });
      await conversation.save();
    }
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ members: { $in: [req.params.userId] } });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const message = new Message(req.body);
    const saved = await message.save();
    res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.conversationId });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
