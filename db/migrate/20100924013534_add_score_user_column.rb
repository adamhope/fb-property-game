class AddScoreUserColumn < ActiveRecord::Migration
  def self.up
    add_column :users, :score, :integer
  end

  def self.down
    remove_column :users, :score
  end
end
