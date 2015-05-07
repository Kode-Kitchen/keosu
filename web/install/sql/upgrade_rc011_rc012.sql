CREATE TABLE LocationTags (id INT AUTO_INCREMENT NOT NULL, tagName VARCHAR(255) NOT NULL, Location_id INT NOT NULL, INDEX IDX_FB06728F80D1AE59 (Location_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;
CREATE TABLE pictureTag (id INT AUTO_INCREMENT NOT NULL, picture_id INT NOT NULL, tagName VARCHAR(255) NOT NULL, INDEX IDX_B3C089ECEE45BDBF (picture_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;
CREATE TABLE PictureTags (id INT AUTO_INCREMENT NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE = InnoDB;
ALTER TABLE LocationTags ADD CONSTRAINT FK_FB06728F80D1AE59 FOREIGN KEY (Location_id) REFERENCES Location (id);
ALTER TABLE pictureTag ADD CONSTRAINT FK_B3C089ECEE45BDBF FOREIGN KEY (picture_id) REFERENCES Picture (id);