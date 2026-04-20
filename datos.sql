-- Limpiar la tabla antes de insertar
TRUNCATE TABLE leads RESTART IDENTITY CASCADE;

-- Insertamos con IDs manuales para asegurar compatibilidad
INSERT INTO
    leads (
        id,
        nombre,
        email,
        fuente,
        producto_interes,
        presupuesto,
        telefono,
        updated_at
    )
VALUES
    (
        '1',
        'Juan Perez',
        'juan.perez@example.com',
        'Web',
        'Software de Ventas',
        1500.00,
        '3001234567',
        NOW()
    ),
    (
        '2',
        'Maria Lopez',
        'm.lopez@direct.com',
        'LinkedIn',
        'CRM Corporativo',
        5000.00,
        '3109876543',
        NOW()
    ),
    (
        '3',
        'Carlos Ruiz',
        'cruiz88@gmail.com',
        'Referido',
        'Servicios Cloud',
        2500.50,
        '3152223344',
        NOW()
    ),
    (
        '4',
        'Ana Gomez',
        'ana.gomez@empresa.co',
        'Web',
        'Software de Ventas',
        1200.00,
        '3204445566',
        NOW()
    ),
    (
        '5',
        'Luis Prada',
        'lprada@tecnologia.net',
        'Instagram',
        'Consultoría IT',
        800.00,
        '3009998877',
        NOW()
    ),
    (
        '6',
        'Elena Mora',
        'emora@asociados.com',
        'Web',
        'Software Contable',
        3000.00,
        '3116667788',
        NOW()
    ),
    (
        '7',
        'Pedro Diaz',
        'pdiaz.pro@outlook.com',
        'LinkedIn',
        'Software de Ventas',
        1800.00,
        '3183334455',
        NOW()
    ),
    (
        '8',
        'Sonia Vega',
        'svega@marketing.com',
        'Web',
        'Analitycs Pro',
        4500.00,
        '3051112233',
        NOW()
    ),
    (
        '9',
        'Jorge Tovar',
        'jtovar@frio.com',
        'Referido',
        'Software Contable',
        2100.00,
        '3145556677',
        NOW()
    ),
    (
        '10',
        'Lucia Rios',
        'lrios@startup.io',
        'LinkedIn',
        'Software de Ventas',
        1650.00,
        '3128889900',
        NOW()
    );