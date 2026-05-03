import { model, models, Schema } from 'mongoose';

const PostSchema = new Schema(
  {
    // _id: {
    //   type: String,
    // },
    id: {
      type: String,
      unique: true,
      required: [true, 'id is required!'],
    },

    title: {
      type: String,
      required: [true, 'Title is required!'],
    },
    description: {
      type: String,
      required: [true, 'Description is required!'],
    },
    topic: {
      type: String,
      enum: ['Training', 'Motivation', 'Nutrition'],
      required: [true, 'Topic is required'],
    },
    image: {
      type: String,
      required: [true, 'Image is required'],
    },
    markup: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// PostSchema.virtual('id').get(function () {
//   return this._id.toHexString();
// });

// PostSchema.set('toJSON', {
//   virtuals: true,
//   transform: function (doc, ret) {
//     delete ret._id;
//   },
// });

const Post = models.Post || model('Post', PostSchema);

export default Post;
