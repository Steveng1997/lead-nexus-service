-- Limpiar la tabla antes de insertar
TRUNCATE TABLE leads RESTART IDENTITY CASCADE;

-- Insertamos asegurando que los nombres de las columnas coincidan con la Interface (CamelCase)
-- En PostgreSQL, las columnas con mayúsculas deben ir entre comillas dobles ""
INSERT INTO
    leads (
        id,
        nombre,
        email,
        fuente,
        producto_interes,
        presupuesto,
        telefono,
        "createdAt",
        "updatedAt",
        "deletedAt"
    )
VALUES
    (
        '00000000-0000-0000-0000-000000000001',
        'Juan Perez',
        'juan.perez@example.com',
        'Web',
        'Software de Ventas',
        1500.00,
        '3001234567',
        NOW(),
        NOW(),
        NULL -- No está eliminado
    ),
    (
        '00000000-0000-0000-0000-000000000002',
        'Maria Lopez',
        'm.lopez@direct.com',
        'LinkedIn',
        'CRM Corporativo',
        5000.00,
        '3109876543',
        NOW(),
        NOW(),
        NULL
    ),
    (
        '00000000-0000-0000-0000-000000000003',
        'Carlos Ruiz',
        'cruiz88@gmail.com',
        'Referido',
        'Servicios Cloud',
        2500.50,
        '3152223344',
        NOW(),
        NOW(),
        NULL
    ),
    (
        '00000000-0000-0000-0000-000000000004',
        'Ana Gomez',
        'ana.gomez@empresa.co',
        'Web',
        'Software de Ventas',
        1200.00,
        '3204445566',
        NOW(),
        NOW(),
        NULL
    ),
    (
        '00000000-0000-0000-0000-000000000005',
        'Luis Prada',
        'lprada@tecnologia.net',
        'Instagram',
        'Consultoría IT',
        800.00,
        '3009998877',
        NOW(),
        NOW(),
        NULL
    );