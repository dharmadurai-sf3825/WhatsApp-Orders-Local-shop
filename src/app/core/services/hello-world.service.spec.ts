describe('HelloWorldService', () => {
    let service;

    beforeEach(() => {
        service = new HelloWorldService();
    });

    it('should return "Hello, World!"', () => {
        expect(service.getHelloWorld()).toBe('Hello, World!');
    });
});