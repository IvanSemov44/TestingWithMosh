import { Theme } from '@radix-ui/themes'
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Category, Product } from '../../src/entities'
import BrowseProducts from '../../src/pages/BrowseProductsPage'
import { CartProvider } from '../../src/providers/CartProvider'
import { db, getProductByCategory } from '../mocks/db'
import { simulateDelay, simulateError } from '../utils'
import AllProvider from '../AllProviders'

describe('BrowseProducts', () => {
    const categories: Category[] = [];
    const products: Product[] = [];

    beforeAll(() => {
        [1, 2].forEach((item) => {
            const category = db.category.create({ name: "Category " + item })
            categories.push(category);
            [1, 2].forEach(() => {
                products.push(db.product.create({ categoryId: category.id }));
            });
        });
    });

    afterAll(() => {
        const categoryIds = categories.map(c => c.id);
        db.category.deleteMany({ where: { id: { in: categoryIds } } });

        const productIds = products.map(p => p.id);
        db.product.deleteMany({ where: { id: { in: productIds } } });
    });



    it('should render a loading skeleton when fetching categories', () => {
        simulateDelay("/categories");
        const { getCategoriesSkeloton } = renderComponent();

        expect(getCategoriesSkeloton()).toBeInTheDocument();
    });

    it(
        'should hide loading skeleton after categories are fetched',
        async () => {
            const { getCategoriesSkeloton } = renderComponent();
            await waitForElementToBeRemoved(getCategoriesSkeloton)
        });

    it(
        'should render a loading skeleton when fetching products',
        () => {
            simulateDelay("/products");
            const { getProductSkeloton } = renderComponent();

            expect(getProductSkeloton()).toBeInTheDocument();
        });

    it(
        'should hide loading skeleton after products are fetched',
        async () => {
            const { getProductSkeloton } = renderComponent();
            await waitForElementToBeRemoved(getProductSkeloton);
        });

    it(
        'should not render an error if categories cannot be fetched',
        async () => {
            simulateError("/categories");
            const { getCategoriesSkeloton, getCategoriesCombobox } = renderComponent();

            await waitForElementToBeRemoved(getCategoriesSkeloton)

            expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
            expect(screen.queryByRole("combobox", { name: /category/i })).not.toBeInTheDocument();
        });

    it(
        'should render an error if product cannot be fetch',
        async () => {
            simulateError("/products");
            renderComponent();

            expect(await screen.findByText(/error/i)).toBeInTheDocument();

        });

    it(
        'should render categories',
        async () => {
            const { getCategoriesSkeloton, getCategoriesCombobox } = renderComponent();

            await waitForElementToBeRemoved(getCategoriesSkeloton);

            const combobox = getCategoriesCombobox();
            expect(combobox).toBeInTheDocument();

            const user = userEvent.setup();
            await user.click(combobox!);

            expect(screen.getByRole("option", { name: /all/i })).toBeInTheDocument();
            categories.forEach((category) => {
                expect(screen.getByRole("option", { name: category.name })).toBeInTheDocument();
            });

        });

    it('should render products', async () => {
        const { getProductSkeloton } = renderComponent();

        await waitForElementToBeRemoved(getProductSkeloton);
        products.forEach(product => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        })
    });

    it('should filter products by category', async () => {
        const { selectCategory, expectProductToBeInTheDocument } = renderComponent();

        const selectedCategory = categories[0];
        await selectCategory(selectedCategory.name);

        const products = getProductByCategory(selectedCategory.id);
        expectProductToBeInTheDocument(products);

    });

    it('should render all products if all category is selected', async () => {
        const { selectCategory, expectProductToBeInTheDocument } = renderComponent();

        await selectCategory(/all/i);

        const products = db.product.getAll();
        expectProductToBeInTheDocument(products);
    });
});

const renderComponent = () => {
    render(<BrowseProducts />, { wrapper: AllProvider });

    const getProductSkeloton = () => screen.queryByRole("progressbar", { name: /product/i });

    const getCategoriesSkeloton = () => screen.queryByRole("progressbar", { name: /categories/i });

    const getCategoriesCombobox = () => screen.queryByRole('combobox');

    const selectCategory = async (name: RegExp | string) => {
        await waitForElementToBeRemoved(getCategoriesSkeloton);
        const combobox = getCategoriesCombobox();
        const user = userEvent.setup();
        await user.click(combobox!);

        const option = screen.getByRole('option', { name });
        await user.click(option);
    };

    const expectProductToBeInTheDocument = (products: Product[]) => {
        const rows = screen.getAllByRole('row');
        const dataRows = rows.slice(1);
        expect(dataRows).toHaveLength(products.length);

        products.forEach((product) => {
            expect(screen.getByText(product.name)).toBeInTheDocument();
        });
    };

    return {
        getProductSkeloton,
        getCategoriesSkeloton,
        getCategoriesCombobox,
        selectCategory,
        expectProductToBeInTheDocument
    };
};