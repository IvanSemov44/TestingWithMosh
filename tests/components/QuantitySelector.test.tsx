import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QuantitySelector from '../../src/components/QuantitySelector';
import { Product } from '../../src/entities';
import { CartProvider } from '../../src/providers/CartProvider';

describe('QuantitySelectory', () => {
    const renderComponent = () => {
        const product: Product = {
            id: 1,
            name: "Milk",
            price: 5,
            categoryId: 1
        }
        render(
            <CartProvider>
                <QuantitySelector product={product} />
            </CartProvider>
        );

        const getAddToCartButton = () => screen.getByRole("button", { name: /add to cart/i });

        const getQuantityControls = () => ({
            quantity: screen.queryByRole("status"),
            incrementButton: screen.queryByRole('button', { name: "+" }),
            decrementButton: screen.queryByRole('button', { name: "-" }),
        });

        const user = userEvent.setup();

        const addToCart = async () => {
            const button = getAddToCartButton();
            await user.click(button!);
        };

        const incrementQuantity = async () => {
            const { incrementButton } = getQuantityControls();
            await user.click(incrementButton!);
        };

        const decrementQuantity = async () => {
            const { decrementButton } = getQuantityControls();
            await user.click(decrementButton!);
        };

        return {
            getAddToCartButton,
            getQuantityControls,
            addToCart,
            incrementQuantity,
            decrementQuantity
        };
    };

    it('should render Add to cart button', () => {
        const { getAddToCartButton } = renderComponent();

        expect(getAddToCartButton()).toBeInTheDocument();
    });

    it('should add a product to the cart', async () => {
        const { addToCart, getQuantityControls } = renderComponent();

        await addToCart();
        const { quantity, incrementButton, decrementButton } = getQuantityControls();

        expect(quantity).toHaveTextContent("1");
        expect(incrementButton).toBeInTheDocument();
        expect(decrementButton).toBeInTheDocument();

        expect(screen.queryByRole("button", { name: /add to cart/i })).not.toBeInTheDocument();
    });

    it('should increment the quantity', async () => {
        const { incrementQuantity, addToCart, getQuantityControls } = renderComponent();
        await addToCart();

        await incrementQuantity();

        const { quantity } = getQuantityControls();
        expect(quantity).toHaveTextContent("2");
    });

    it('should decrement the quantity', async () => {
        const { incrementQuantity, decrementQuantity, addToCart, getQuantityControls } = renderComponent();
        await addToCart();
        await incrementQuantity();

        await decrementQuantity();

        const { quantity } = getQuantityControls();
        expect(quantity).toHaveTextContent("1");
    });

    it('should remove the product from the cart', async () => {
        const { decrementQuantity, addToCart, getAddToCartButton, getQuantityControls } = renderComponent();
        await addToCart();

        await decrementQuantity();

        const { quantity, decrementButton, incrementButton } = getQuantityControls();
        expect(quantity).not.toBeInTheDocument();
        expect(decrementButton).not.toBeInTheDocument();
        expect(incrementButton).not.toBeInTheDocument();
        expect(getAddToCartButton()).toBeInTheDocument();
    });
});