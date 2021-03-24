import {Schema, model} from 'mongoose';

const ListSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  listItems: [{
    title: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    externalId: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    }
  }],
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user"
  }
});

const List = model("list", ListSchema);

export default List;
