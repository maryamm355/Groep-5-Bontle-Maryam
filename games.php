<?php
require 'db.php';
include 'headerlogin.php';

// Haal alle games op uit de database
$stmt = $pdo->query("SELECT * FROM games");
$games = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alle Games</title>
    <link rel="stylesheet" href="style/style.css">
</head>

<body>
<main>

    <h1 class="page-title">Alle Games</h1>

    <a href="add.php" class="btn-add">Nieuwe game toevoegen</a>

    <section class="games-list">
        <?php foreach ($games as $game): ?>
            <article class="game-card">
                <img src="<?= $game['image_url'] ?>" alt="<?= $game['title'] ?>" class="game-image">

                <h2><?= $game['title'] ?></h2>
                <p>Genre: <?= $game['genre'] ?></p>
                <p>Platform: <?= $game['platform'] ?></p>
                <p>Prijs: €<?= $game['price'] ?></p>

                <div class="game-actions">
                    <a href="edit.php?id=<?= $game['id'] ?>" class="btn-edit">Bewerken</a>
                    <a href="delete.php?id=<?= $game['id'] ?>" class="btn-delete">Verwijderen</a>
                </div>
            </article>
        <?php endforeach; ?>
    </section>

</main>
</body>
</html>
