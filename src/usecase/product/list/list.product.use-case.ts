import {InputListProductDto, OutputListProductDto, OutputProductMapper} from './list.product.dto';
import ProductRepositoryInterface from '../../../domain/product/repository/product.repository.interface';

export default class ListProductUseCase {
    private productRepository: ProductRepositoryInterface;

    constructor(productRepository: ProductRepositoryInterface) {
        this.productRepository = productRepository;
    }

    async execute(input: InputListProductDto): Promise<OutputListProductDto> {

        const products = await this.productRepository.findAll();
        return OutputProductMapper.toOutput(products);
    }
}