import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    products:{
        type: [
            {
                id_product: {
                    type: Schema.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                quantity:{
                    type: Number,
                    required: true
                }
            }
        ],
        default: function () {
            return [];
        }
    }
});

cartSchema.pre('findOne', function () {
    this.populate('products.id_product')
})


const cartModel = model('carts', cartSchema);
export default cartModel;