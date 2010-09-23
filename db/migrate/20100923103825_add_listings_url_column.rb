class AddListingsUrlColumn < ActiveRecord::Migration
  def self.up
    add_column :listings, :image_url, :text
  end

  def self.down
    remove_column :listings, :image_url
  end
end
