INSERT INTO department (name)
VALUES ("Tank"),
       ("Healer"),
       ("Caster"),
       ("Ranged"),
       ("Melee"),
       ("Admin");

INSERT INTO role (title, salary, department_id)
VALUES ("Leader", 90000, 6),
       ("Gunbreaker", 90000, 1),
       ("Marauder", 75000, 1),
       ("Astrologian", 90000, 2),
       ("Conjurer", 80000, 2),
       ("Arcanist", 80000, 2),
       ("Red Mage", 75000, 3),
       ("Black Mage", 75000, 3),
       ("Archer", 70000, 4),
       ("Dragoon", 70000, 5),
       ("Monk", 65000, 5),
       ("Accountant", 65000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Minfilia", "Warde", 1, NULL),
       ("Thancred", "Waters", 2, 1),
       ("Y'shtola", "Rhul", 8, 1),
       ("Urianger", "Augurelt", 4, 1),
       ("Moenbryda", "Wilfsunnwyn", 3, 2),
       ("Papalymo", "Totolymo", 8, 4),
       ("Lyse", "Hext", 11, 2),
       ("Alisae", "Leveilleur", 7, NULL),
       ("Alphinaud", "Leveilleur", 6, 1),
       ("Krile", "Baldesion", 5, NULL),
       ("Estinien", "Wyrmblood", 10, NULL),
       ("G'raha", "Tia", 9, 3),
       ("Tataru", "Taru", 12, 1);